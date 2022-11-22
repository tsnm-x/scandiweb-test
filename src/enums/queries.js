const queries = {
    categories: `{
        categories{
            name
        }
    }`,
    currencies: `{
        currencies{
            label,
            symbol
        }
    }`,
    products: (category) => {
        return `{
            category(input: {title: "${category}"}){
                name,
                products{
                    id,
                    name,
                    inStock,
                    gallery,
                    description,
                    category,
                    attributes{
                      name,
                      items{
                        displayValue,
                        value
                      }
                    },
                    prices{
                      currency{
                        label,
                        symbol
                      },
                      amount
                    },
                    brand
                }
            }
        }`
    },
    product: (id) => {
        return `{
            product(id: "${id}"){
            id,
              name,
              inStock,
              gallery,
              description,
              category,
              attributes{
                name,
                items{
                  displayValue,
                  value
                }
              },
              prices{
                currency{
                  label,
                  symbol
                },
                amount
              },
              brand
          }
        }`
    }
}

export default queries;